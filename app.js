// Aether Prototype – Core Logic

function startApp() {
  document.getElementById('splash').classList.remove('active');
  document.getElementById('app').classList.add('active');
  updateTime();
  updateGreeting();
  populateKnowledge();
  setInterval(updateTime, 30000);
}

function updateTime() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('current-time').textContent = `${h}:${m}`;
}

function updateGreeting() {
  const hour = new Date().getHours();
  let text = 'Good evening';
  if (hour < 12) text = 'Good morning';
  else if (hour < 17) text = 'Good afternoon';
  document.getElementById('greeting-text').textContent = text;
}

function showScreen(id) {
  // Hide all views and reset display
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
    v.style.display = '';
  });
  // Show target
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    if (id === 'agent') {
      target.style.display = 'flex';
    }
  }

  // Update bottom nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === id);
  });
}

function toggleTheme() {
  const body = document.body;
  const current = body.getAttribute('data-theme');
  body.setAttribute('data-theme', current === 'light' ? '' : 'light');
}

function toggleLargeText() {
  document.body.classList.toggle('large-text', document.getElementById('large-text').checked);
}

function toggleHighContrast() {
  document.body.classList.toggle('high-contrast', document.getElementById('high-contrast').checked);
}

// ===== CHAT / AGENT =====
const responses = {
  'Research careers in renewable energy and create a 30-day learning plan': `Here's a focused 30-day plan based on your existing Climate Systems knowledge:

**Week 1 – Foundations**
• Review your current notes on energy systems (already 68% complete)
• Read: IRENA Renewable Energy Outlook (key chapters)
• Output: 1-page summary of top 5 career pathways

**Week 2 – Skills Mapping**
• Identify transferable skills from your background
• Free courses: Coursera “Solar Energy Basics” + edX “Wind Energy”
• Output: Personal skill gap list

**Week 3 – Real-world Exposure**
• Informational interviews (I can draft outreach messages)
• Local renewable projects or virtual open days
• Output: 3 contact notes added to Knowledge Graph

**Week 4 – Decision & Next Steps**
• Budget comparison of certificate programs
• Draft 90-day action plan after the 30 days
• Schedule deep-work blocks in your peak focus window (10:00–13:00)

Would you like me to add these as calendar tasks and create a new Learning Path?`,

  'Summarize my recent notes on sleep and suggest schedule changes': `From your last 14 days of health + capture data:

**Key patterns**
• Average sleep: 7.2 h (deep sleep +12% vs previous period)
• Best cognitive days follow nights with >1.5 h deep sleep
• Afternoon energy dip is consistent around 14:30–16:00

**Recommended schedule adjustments**
1. Protect 10:00–13:30 as “Deep Work” (your peak window)
2. Move lighter tasks (email, admin) to 14:30–16:00
3. Aim for consistent wind-down by 22:15 to protect deep sleep
4. Short 10-min walk after lunch improves afternoon focus by ~18% in your data

I can update your priorities and create recurring focus blocks. Shall I proceed?`,

  'Help me budget for an online course next month': `Based on your recent finance captures and typical monthly patterns:

**Suggested approach**
• Target course budget: $80–150 (most highly-rated renewable/Spanish courses fall here)
• Current estimated discretionary: ~$210 after essentials
• Recommendation: Allocate $120 this month → leaves buffer

**Actions I can take**
1. Create a “Course Fund” sinking category
2. Set a gentle weekly reminder to transfer $30
3. Flag any new subscriptions that appear
4. Link this to your Climate Systems or Spanish path automatically

Would you like me to set up the sinking fund and reminders?`
};

function sendPrompt(text) {
  document.getElementById('chat-input').value = text;
  sendMessage();
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  const container = document.getElementById('chat-container');

  // User message
  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
  container.appendChild(userMsg);

  input.value = '';
  container.scrollTop = container.scrollHeight;

  // Simulate thinking
  setTimeout(() => {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai';
    let reply = responses[text];
    if (!reply) {
      reply = `I understand you want help with: “${text}”.

In the full Aether app I would:
• Search your Personal Knowledge Graph for related notes
• Pull relevant health or schedule context
• Break the request into clear steps
• Offer concrete next actions you can accept or edit

This is a high-fidelity prototype, so I’m showing the interaction pattern. In production every response is grounded in your private data and runs primarily on-device.

What would you like to refine or do next?`;
    }
    aiMsg.innerHTML = `<div class="msg-bubble">${reply.replace(/\n/g, '<br>')}</div>`;
    container.appendChild(aiMsg);
    container.scrollTop = container.scrollHeight;
  }, 700);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== CAPTURE =====
function simulateCapture(type) {
  const result = document.getElementById('capture-result');
  const textEl = document.getElementById('capture-text');
  result.classList.remove('hidden');

  const samples = {
    voice: '“I noticed that after 7+ hours of sleep with good deep sleep I can focus much better on complex climate models. Should protect mornings.”',
    photo: 'Photo of whiteboard notes on energy feedback loops — OCR extracted and linked to Climate Systems path.',
    text: 'Key insight: local renewable cooperatives may be a strong career entry point in my region.',
    link: 'Saved article: “IRENA 2026 Renewable Jobs Outlook” → auto-summarized and connected to Career Transition node.'
  };

  textEl.textContent = samples[type] || 'Captured successfully.';
  // Scroll to result
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== RESEARCH =====
function runResearch() {
  const query = document.getElementById('research-query').value.trim();
  if (!query) return;

  const result = document.getElementById('research-result');
  result.classList.remove('hidden');

  document.getElementById('research-findings').innerHTML = `
    <p><strong>Query:</strong> ${escapeHtml(query)}</p>
    <p style="margin-top:0.6rem">Top synthesized findings (demo):</p>
    <ul style="margin:0.5rem 0 0 1.1rem; color:var(--text-muted)">
      <li>Global renewable energy employment reached 13.7 million in recent data, with strong growth in solar and wind.</li>
      <li>Skills most in demand: systems thinking, project management, and basic data literacy.</li>
      <li>Certificate programs (3–6 months) often provide faster entry than full degrees for career switchers.</li>
    </ul>
    <p class="meta" style="margin-top:0.8rem">Sources would be fully cited and verifiable in production.</p>
  `;

  document.getElementById('research-notes').textContent = `## Research Notes – ${query}

### Core Concepts
- Energy transition pathways
- Job market dynamics 2025-2030
- Skill adjacency mapping

### Open Questions
- Regional demand differences?
- Remote vs on-site opportunities?

### Linked to existing knowledge
- Climate Systems path (68%)
- Career transition node`;

  document.getElementById('research-actions').innerHTML = `
    <li><span class="check">○</span> Create 30-day learning plan from findings</li>
    <li><span class="check">○</span> Add key papers to Knowledge Graph</li>
    <li><span class="check">○</span> Draft outreach messages for informational interviews</li>
  `;

  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function addToPlan() {
  alert('Actions added to your priorities and Learning Paths (demo). In the full app this would update Home and calendar.');
}

// ===== KNOWLEDGE =====
const knowledgeNodes = [
  'Climate Systems', 'Sleep Quality', 'Focus Windows', 'Renewable Energy',
  'Career Transition', 'Spanish Practice', 'Budget Planning', 'Deep Work',
  'Energy Balance', 'Travel Goals 2027', 'Medication Reminders', 'Weekly Review',
  'Feedback Loops', 'Skill Gaps', 'Morning Routine', 'Local Cooperatives',
  'Deep Sleep', 'Course Fund', 'Informational Interviews', 'Wind-down Ritual'
];

function populateKnowledge() {
  const container = document.getElementById('kg-nodes');
  container.innerHTML = '';
  knowledgeNodes.forEach(n => {
    const chip = document.createElement('span');
    chip.className = 'node-chip';
    chip.textContent = n;
    container.appendChild(chip);
  });
}

function filterKnowledge() {
  const q = document.getElementById('kg-search').value.toLowerCase();
  document.querySelectorAll('.node-chip').forEach(chip => {
    const match = chip.textContent.toLowerCase().includes(q);
    chip.style.display = match || !q ? '' : 'none';
    chip.classList.toggle('highlight', match && q.length > 1);
  });
}

// Initialize time on load
updateTime();
