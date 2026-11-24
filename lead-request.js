const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");

const FROM_EMAIL = "paolo@riverayrivera.net";
const TO_EMAIL = "servicioalcliente@atip.com.pe";
const buckets = new Map();
let clientPromise;

function clean(value, max = 1500) {
  return String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}
function reply(res, status, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(body);
}
function rateAllowed(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = String(req.headers["x-real-ip"] || (typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "unknown"));
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || current.until < now) { buckets.set(ip, {count: 1, until: now + 60000}); return true; }
  if (current.count >= 5) return false;
  current.count += 1;
  return true;
}
function getClient(uri) {
  if (!clientPromise) {
    const client = new MongoClient(uri, {maxPoolSize: 3, serverSelectionTimeoutMS: 8000});
    clientPromise = client.connect().catch(error => { clientPromise = undefined; throw error; });
  }
  return clientPromise;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return reply(res, 405, {error:"method_not_allowed"}); }
  if (!rateAllowed(req)) return reply(res, 429, {error:"rate_limited"});
  const origin = req.headers.origin, host = req.headers.host;
  if (origin && host) {
    try { if (new URL(origin).host !== host) return reply(res, 403, {error:"origin_not_allowed"}); }
    catch { return reply(res, 403, {error:"origin_not_allowed"}); }
  }
  const body = typeof req.body === "string" ? (() => { try { return JSON.parse(req.body); } catch { return null; } })() : req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) return reply(res, 400, {error:"invalid_request"});
  if (body.consent !== true) return reply(res, 422, {error:"consent_required"});
  if (!["general","staffing"].includes(body.type)) return reply(res, 422, {error:"invalid_request_type"});
  const contact = body.contact || {};
  const cleanContact = {
    name: clean(contact.name, 120),
    company: clean(contact.company, 160),
    email: clean(contact.email, 254).toLowerCase(),
    phone: clean(contact.phone, 60)
  };
  if (!cleanContact.name || !cleanContact.company || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(cleanContact.email)) {
    return reply(res, 422, {error:"valid_contact_required"});
  }
  const request = {
    service: clean(body.service || (body.type === "staffing" ? "Staffing" : "General inquiry"), 120),
    summary: clean(body.need, 3000)
  };
  if (!request.summary) return reply(res, 422, {error:"request_summary_required"});
  let staffing;
  if (body.type === "staffing") {
    const input = body.staffing || {};
    staffing = {
      profileFamily: clean(input.profileFamily, 120), platform: clean(input.platform, 120),
      role: clean(input.role, 200), skills: clean(input.skills, 1500),
      seniority: clean(input.seniority, 100), quantity: clean(input.quantity, 50),
      duration: clean(input.duration, 100), workMode: clean(input.workMode, 100),
      location: clean(input.location, 160), start: clean(input.start, 100),
      context: clean(input.context, 1500)
    };
    if (!staffing.role || !staffing.quantity) return reply(res, 422, {error:"staffing_details_required"});
  }
  const uri = process.env.MONGODB_WRITE_URI;
  if (!uri) return reply(res, 503, {error:"staffing_storage_not_configured"});
  const document = {
    type: body.type, language: body.language === "en" ? "en" : "es",
    source: "atip-website-chat", status: "new",
    contact: cleanContact, request, ...(staffing ? {staffing} : {}),
    consent: {accepted: true, acceptedAt: new Date()},
    createdAt: new Date()
  };
  try {
    const client = await getClient(uri);
    const db = client.db(process.env.MONGODB_DATABASE || "atip");
    const saved = await db.collection("lead_requests").insertOne(document);
    let notified = false;
    const smtpHost = process.env.ZOHO_SMTP_HOST;
    const smtpPort = Number(process.env.ZOHO_SMTP_PORT);
    const smtpUser = process.env.ZOHO_SMTP_USER;
    const smtpPassword = process.env.ZOHO_SMTP_APP_PASSWORD;
    if (smtpHost && [465,587].includes(smtpPort) && smtpUser && smtpPassword && smtpUser.toLowerCase() === FROM_EMAIL) {
      try {
        const mailer = nodemailer.createTransport({host:smtpHost,port:smtpPort,secure:smtpPort===465,auth:{user:smtpUser,pass:smtpPassword},connectionTimeout:10000});
        const lines = ["Nuevo lead AT.ip", "Tipo: " + body.type, "Servicio: " + request.service, "Resumen: " + request.summary, "Empresa: " + cleanContact.company, "Contacto: " + cleanContact.name, "Correo: " + cleanContact.email, "Teléfono: " + (cleanContact.phone || "No indicado")];
        if (staffing) lines.push("Perfil: " + staffing.role, "Plataforma: " + staffing.platform, "Cantidad: " + staffing.quantity, "Duración: " + staffing.duration, "Modalidad: " + staffing.workMode, "Ubicación: " + staffing.location);
        await mailer.sendMail({from:{name:"AT.ip",address:FROM_EMAIL},to:TO_EMAIL,subject:"Nueva solicitud " + body.type + " | AT.ip",text:lines.join("\n")});
        notified = true;
      } catch (error) { console.error("Lead notification failed", error && error.code || "mail_error"); }
    }
    return reply(res, 201, {ok:true, id:saved.insertedId.toString(), notified});
  } catch (error) {
    console.error("Lead request save failed", error && error.name || "unknown_error", String(error && error.message || "").replace(uri,"[MONGODB_WRITE_URI]"));
    return reply(res, 502, {error:"lead_save_failed"});
  }
};
