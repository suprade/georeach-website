const SUPABASE_URL = "https://viezjjnpconukdqhpafz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gWzbfvGfB6U2-VlPXY2pGw_mmIv7B--";

const sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* =========================
   ELEMENTS
========================= */

const loginScreen = document.getElementById("login-screen");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

const adminEmail = document.getElementById("admin-email");
const logoutBtn = document.getElementById("logout-btn");

const totalLeads = document.getElementById("total-leads");
const newLeads = document.getElementById("new-leads");
const contactedLeads = document.getElementById("contacted-leads");
const convertedLeads = document.getElementById("converted-leads");

const leadsTableBody = document.getElementById("leads-table-body");

const leadSearch = document.getElementById("lead-search");
const statusFilter = document.getElementById("status-filter");


let allLeads = [];


/* =========================
   AUTH CHECK
========================= */

async function checkAuth() {

  const {
    data: { session }
  } = await sb.auth.getSession()

  if (session) {

    showDashboard(session.user);

  } else {

    showLogin();

  }
}


/* =========================
   SHOW LOGIN
========================= */

function showLogin() {

  loginScreen.classList.remove("hidden");
  dashboard.classList.add("hidden");

}


/* =========================
   SHOW DASHBOARD
========================= */

function showDashboard(user) {

  loginScreen.classList.add("hidden");
  dashboard.classList.remove("hidden");

  adminEmail.textContent = user.email || "";

  loadLeads();

}


/* =========================
   LOGIN
========================= */

loginForm.addEventListener("submit", async function (event) {

  event.preventDefault();

  loginError.textContent = "";

  const email =
    document.getElementById("login-email").value.trim();

  const password =
    document.getElementById("login-password").value;

  const button =
    loginForm.querySelector("button[type='submit']");

  button.disabled = true;
  button.textContent = "Signing in...";


  const {
  data,
  error
} = await window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
).auth.signInWithPassword({
  email,
  password
});


  button.disabled = false;
  button.textContent = "Sign In";


  if (error) {

    console.error("Login error:", error);

    loginError.textContent =
      "Invalid email or password.";

    return;
  }


  showDashboard(data.user);

});


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener("click", async function () {

  await sb.auth.signOut();

  allLeads = [];

  showLogin();

});


/* =========================
   AUTH STATE
========================= */

sb.auth.onAuthStateChange(function (
  event,
  session
) {

  if (session) {

    showDashboard(session.user);

  } else {

    showLogin();

  }

});


/* =========================
   LOAD LEADS
========================= */

async function loadLeads() {

  leadsTableBody.innerHTML = `
    <tr>
      <td colspan="7" class="loading">
        Loading leads...
      </td>
    </tr>
  `;


  const {
    data,
    error
  } = await sb
    .from("leads")
    .select("*")
    .order("id", {
      ascending: false
    });


  if (error) {

    console.error("Load leads error:", error);

    leadsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty">
          Unable to load leads.
        </td>
      </tr>
    `;

    return;
  }


  allLeads = data || [];

  updateStats();

  renderLeads(allLeads);

}


/* =========================
   UPDATE STATS
========================= */

function updateStats() {

  const total = allLeads.length;

  const newCount =
    allLeads.filter(
      lead => normalizeStatus(lead.status) === "new"
    ).length;

  const contactedCount =
    allLeads.filter(
      lead => normalizeStatus(lead.status) === "contacted"
    ).length;

  const convertedCount =
    allLeads.filter(
      lead => normalizeStatus(lead.status) === "converted"
    ).length;


  totalLeads.textContent = total;

  newLeads.textContent = newCount;

  contactedLeads.textContent = contactedCount;

  convertedLeads.textContent = convertedCount;

}


/* =========================
   NORMALIZE STATUS
========================= */

function normalizeStatus(status) {

  return String(status || "New")
    .trim()
    .toLowerCase();

}


/* =========================
   RENDER LEADS
========================= */

function renderLeads(leads) {

  if (!leads.length) {

    leadsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty">
          No leads found.
        </td>
      </tr>
    `;

    return;
  }


  leadsTableBody.innerHTML = leads.map(function (lead) {

    const status =
      lead.status || "New";

    const statusClass =
      getStatusClass(status);

    const phone =
      lead.phone || "";

    const email =
      lead.email || "";

    const followUp =
      lead.follow_up_date
        ? formatDate(lead.follow_up_date)
        : "—";


    return `
      <tr>

        <td>
          <strong>
            ${escapeHtml(lead.name || "—")}
          </strong>
        </td>


        <td>

          ${
            phone
              ? `
                <div>
                  ${escapeHtml(phone)}
                </div>
              `
              : ""
          }

          ${
            email
              ? `
                <div style="color:#687083;margin-top:4px;">
                  ${escapeHtml(email)}
                </div>
              `
              : ""
          }

        </td>


        <td>
          ${escapeHtml(lead.company || "—")}
        </td>


        <td>
          ${escapeHtml(lead.service || "—")}
        </td>


        <td>

          <span class="status ${statusClass}">
            ${escapeHtml(status)}
          </span>

        </td>


        <td>
          ${followUp}
        </td>


        <td>

          ${
            phone
              ? `
                <a
                  class="action-btn"
                  href="tel:${encodeURIComponent(phone)}"
                >
                  Call
                </a>
              `
              : ""
          }


          ${
            phone
              ? `
                <a
                  class="action-btn"
                  href="https://wa.me/91${cleanPhone(phone)}"
                  target="_blank"
                  rel="noopener"
                >
                  WhatsApp
                </a>
              `
              : ""
          }


          ${
            email
              ? `
                <a
                  class="action-btn"
                  href="mailto:${encodeURIComponent(email)}"
                >
                  Email
                </a>
              `
              : ""
          }

        </td>

      </tr>
    `;

  }).join("");

}


/* =========================
   STATUS CLASS
========================= */

function getStatusClass(status) {

  const normalized =
    normalizeStatus(status);


  if (normalized === "contacted") {

    return "status-contacted";

  }


  if (normalized === "converted") {

    return "status-converted";

  }


  if (normalized === "closed") {

    return "status-closed";

  }


  return "status-new";

}


/* =========================
   SEARCH
========================= */

function filterLeads() {

  const query =
    leadSearch.value
      .trim()
      .toLowerCase();


  const selectedStatus =
    statusFilter.value
      .trim()
      .toLowerCase();


  const filtered =
    allLeads.filter(function (lead) {

      const searchableText = [

        lead.name,
        lead.phone,
        lead.email,
        lead.company,
        lead.service,
        lead.message

      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();


      const matchesSearch =
        !query ||
        searchableText.includes(query);


      const matchesStatus =
        !selectedStatus ||
        normalizeStatus(lead.status) === selectedStatus;


      return matchesSearch && matchesStatus;

    });


  renderLeads(filtered);

}


leadSearch.addEventListener(
  "input",
  filterLeads
);


statusFilter.addEventListener(
  "change",
  filterLeads
);


/* =========================
   FORMAT DATE
========================= */

function formatDate(date) {

  if (!date) return "—";


  const d =
    new Date(date + "T00:00:00");


  return d.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


/* =========================
   PHONE CLEANER
========================= */

function cleanPhone(phone) {

  return String(phone)
    .replace(/\D/g, "")
    .replace(/^91/, "");

}


/* =========================
   HTML ESCAPE
========================= */

function escapeHtml(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================
   START
========================= */

checkAuth();