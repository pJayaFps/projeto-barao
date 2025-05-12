// Constants
const STORAGE_KEY = 'school-calendar-events';
const USERS_STORAGE_KEY = 'school-calendar-users';
const EVENT_CATEGORIES = [
  { value: 'homework', label: 'Tarefa' },
  { value: 'exam', label: 'Prova' },
  { value: 'activity', label: 'Atividade' },
  { value: 'meeting', label: 'Reunião' },
  { value: 'other', label: 'Outro' },
];

// State
let events = [];
let currentDate = new Date();
let currentView = 'month';
let selectedDate = null;
let eventToEdit = null;
let shownNotifications = new Set();
let currentUser = null;
let isLoggedIn = false;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Initialize
  setupUsers();
  checkLoginStatus();
  loadEvents();
  setupEventListeners();
  initNotifications();
  renderCalendar(); // mostra o calendário logo
});

function menuShow() {
    let menuMobile = document.querySelector('.mobile-menu');
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.querySelector('.icon').src = "../menu_white_36dp.svg";
    } else {
        menuMobile.classList.add('open');
        document.querySelector('.icon').src = "../close_white_36dp.svg";
    }
}

// User Management
function setupUsers() {
  // Check if users exist, if not create admin user
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  if (users.length === 0) {
    // Create default admin account
    const adminUser = {
      username: 'admin',
      password: 'admin123', // Consider using a more secure password
      isAdmin: true,
      canEdit: true
    };
    users.push(adminUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    console.log('Default admin user created: admin / admin123');
  }
}

function showLoginButton() {
  const headerRight = document.querySelector('#calendar-header .flex.items-center.space-x-2');

  if (!headerRight || document.getElementById('login-btn')) return;

  const loginBtn = document.createElement('button');
  loginBtn.textContent = 'Login';
  loginBtn.id = 'login-btn';
  loginBtn.className = 'btn btn-outline';
  loginBtn.addEventListener('click', showLoginForm);

  headerRight.appendChild(loginBtn);
}

function showLoginForm() {
  if (document.getElementById('login-modal')) return;

  const modalHTML = `
    <div id="login-modal" class="dialog open">
      <div class="dialog-overlay"></div>
      <div class="dialog-content max-w-md mx-auto">
        <div class="dialog-header">
          <div class="dialog-title">Login do Administrador</div>
        </div>
        <form id="auth-form" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium mb-1">Usuário</label>
            <input id="username" type="text" class="input" required />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium mb-1">Senha</label>
            <input id="password" type="password" class="input" required />
          </div>
          <div class="dialog-footer">
            <button type="button" class="btn btn-outline" id="cancel-login-btn">Voltar</button>
            <button type="submit" class="btn btn-primary">Entrar</button>
          </div>
        </form>
        <button class="dialog-close" id="close-login-modal-btn">×</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Evento de envio de login
  document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
    closeLoginModal();
  });

  // Eventos de "Voltar" e "X"
  document.getElementById('close-login-modal-btn').addEventListener('click', closeLoginModal);
  document.getElementById('cancel-login-btn').addEventListener('click', closeLoginModal);
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.remove();
}


function checkLoginStatus() {
  // Check if user is logged in from session storage
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    currentUser = JSON.parse(userStr);
    isLoggedIn = true;
    showLoggedInUI();
  } else {
    showLoginButton();
  } 
}

function login(username, password) {
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    currentUser = user;
    isLoggedIn = true;
    // Store in session storage
    localStorage.setItem('currentUser', JSON.stringify(user));
    showLoggedInUI();
    showToast({
      title: 'Login bem sucedido',
      description: `Bem-vindo, ${username}!`,
      type: 'success'
    });
    return true;
  } else {
    showToast({
      title: 'Erro de login',
      description: 'Usuário ou senha incorretos',
      type: 'error'
    });
    return false;
  }
}

function logout() {
  currentUser = null;
  isLoggedIn = false;
  localStorage.removeItem('currentUser');
  showToast({
    title: 'Logout concluído',
    description: 'Você foi desconectado',
    type: 'info'
  });

  setTimeout(() => {
    location.reload();
  }, 500);
}

function showLoggedInUI() {

  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) loginBtn.remove();
  
  // Show the calendar content
  document.getElementById('calendar-container').classList.remove('hidden');
  
  // Hide login form if present
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.classList.add('hidden');
  }
  
  // Update UI based on user permissions
  updateUIBasedOnPermissions();
  renderCalendar();
}

function updateUIBasedOnPermissions() {
  const editElements = document.querySelectorAll('.edit-permission');
  const adminElements = document.querySelectorAll('.admin-permission');
  
  // Update user info in header
  const userInfoElement = document.getElementById('user-info');
  if (userInfoElement) {
    userInfoElement.textContent = currentUser.username;
  } else {
    // Add user info and logout button if they don't exist
    const userControls = `
      <div class="ml-auto flex items-center space-x-2">
        <span id="user-info" class="text-sm">${currentUser.username}</span>
        <button id="logout-btn" class="btn btn-ghost btn-sm">Sair</button>
        ${currentUser.isAdmin ? '<button id="admin-btn" class="btn btn-ghost btn-sm">Administrar</button>' : ''}
      </div>
    `;
    document.getElementById('calendar-header').querySelector('.flex.items-center.space-x-2').insertAdjacentHTML('beforeend', userControls);
    
    // Add logout button event listener
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Add admin button event listener if user is admin
    if (currentUser.isAdmin) {
      document.getElementById('admin-btn').addEventListener('click', showAdminPanel);
    }
  }
  
  // Show/hide edit elements based on canEdit permission
  editElements.forEach(el => {
    if (currentUser.canEdit) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
  
  // Show/hide admin elements based on isAdmin permission
  adminElements.forEach(el => {
    if (currentUser.isAdmin) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}

function showAdminPanel() {
  // Fetch users for display
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  
  // Create modal HTML
  const adminPanelHTML = `
    <div id="admin-panel-modal" class="dialog open">
      <div class="dialog-overlay"></div>
      <div class="dialog-content max-w-md mx-auto">
        <div class="dialog-header">
          <div class="dialog-title">Painel de Administração</div>
        </div>
        
        <div class="space-y-4">
          <div class="border-b pb-4">
            <h3 class="font-medium mb-2">Usuários</h3>
            <div class="space-y-2" id="users-list">
              ${users.map(user => `
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div class="font-medium">${user.username}</div>
                    <div class="text-xs text-gray-500">
                      ${user.isAdmin ? 'Administrador' : 'Usuário'} | 
                      ${user.canEdit ? 'Pode editar' : 'Somente leitura'}
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button class="btn btn-ghost btn-sm edit-user-btn" data-username="${user.username}">
                      Editar
                    </button>
                    ${user.username !== 'admin' ? `
                      <button class="btn btn-ghost btn-sm text-red-500 delete-user-btn" data-username="${user.username}">
                        Excluir
                      </button>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
            <button id="add-user-btn" class="btn btn-outline btn-sm mt-2">
              Adicionar Usuário
            </button>
          </div>
          
          <div class="dialog-footer">
            <button type="button" class="btn btn-primary" id="close-admin-panel-btn">
              Fechar
            </button>
          </div>
        </div>
        
        <button class="dialog-close" id="close-admin-modal-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">Fechar</span>
        </button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', adminPanelHTML);
  
  // Add event listeners
  document.getElementById('close-admin-panel-btn').addEventListener('click', closeAdminPanel);
  document.getElementById('close-admin-modal-btn').addEventListener('click', closeAdminPanel);
  document.getElementById('add-user-btn').addEventListener('click', showAddUserForm);
  
  // Add event listeners to user action buttons
  document.querySelectorAll('.edit-user-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const username = btn.dataset.username;
      showEditUserForm(username);
    });
  });
  
  document.querySelectorAll('.delete-user-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const username = btn.dataset.username;
      deleteUser(username);
    });
  });
}

function closeAdminPanel() {
  const adminPanel = document.getElementById('admin-panel-modal');
  if (adminPanel) {
    adminPanel.remove();
  }
}

function showAddUserForm() {
  const addUserFormHTML = `
    <div id="user-form-modal" class="dialog open">
      <div class="dialog-overlay"></div>
      <div class="dialog-content max-w-md mx-auto">
        <div class="dialog-header">
          <div class="dialog-title">Adicionar Usuário</div>
        </div>
        
        <form id="user-form" class="space-y-4">
          <div>
            <label for="new-username" class="block text-sm font-medium mb-1">
              Usuário
            </label>
            <input
              id="new-username"
              class="input"
              required
              placeholder="Nome de usuário"
            />
          </div>
          
          <div>
            <label for="new-password" class="block text-sm font-medium mb-1">
              Senha
            </label>
            <input
              id="new-password"
              type="password"
              class="input"
              required
              placeholder="Senha"
            />
          </div>
          
          <div class="flex items-center space-x-2">
            <input
              id="can-edit"
              type="checkbox"
              class="rounded text-primary focus:ring-primary"
            />
            <label for="can-edit" class="text-sm">
              Pode editar eventos
            </label>
          </div>
          
          <div class="flex items-center space-x-2">
            <input
              id="is-admin"
              type="checkbox"
              class="rounded text-primary focus:ring-primary"
            />
            <label for="is-admin" class="text-sm">
              É administrador
            </label>
          </div>
          
          <div class="dialog-footer mt-6">
            <button type="button" class="btn btn-outline" id="cancel-user-btn">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" id="save-user-btn">
              Salvar
            </button>
          </div>
        </form>
        
        <button class="dialog-close" id="close-user-modal-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">Fechar</span>
        </button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', addUserFormHTML);
  
  // Add event listeners
  document.getElementById('user-form').addEventListener('submit', addUser);
  document.getElementById('cancel-user-btn').addEventListener('click', closeUserForm);
  document.getElementById('close-user-modal-btn').addEventListener('click', closeUserForm);
}

function showEditUserForm(username) {
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  const user = users.find(u => u.username === username);
  
  if (!user) return;
  
  const editUserFormHTML = `
    <div id="user-form-modal" class="dialog open">
      <div class="dialog-overlay"></div>
      <div class="dialog-content max-w-md mx-auto">
        <div class="dialog-header">
          <div class="dialog-title">Editar Usuário</div>
        </div>
        
        <form id="user-form" class="space-y-4" data-edit-username="${username}">
          <div>
            <label for="new-username" class="block text-sm font-medium mb-1">
              Usuário
            </label>
            <input
              id="new-username"
              class="input"
              required
              placeholder="Nome de usuário"
              value="${user.username}"
              ${username === 'admin' ? 'readonly' : ''}
            />
          </div>
          
          <div>
            <label for="new-password" class="block text-sm font-medium mb-1">
              Senha (deixe em branco para não alterar)
            </label>
            <input
              id="new-password"
              type="password"
              class="input"
              placeholder="Nova senha"
            />
          </div>
          
          <div class="flex items-center space-x-2">
            <input
              id="can-edit"
              type="checkbox"
              class="rounded text-primary focus:ring-primary"
              ${user.canEdit ? 'checked' : ''}
              ${username === 'admin' ? 'disabled' : ''}
            />
            <label for="can-edit" class="text-sm">
              Pode editar eventos
            </label>
          </div>
          
          <div class="flex items-center space-x-2">
            <input
              id="is-admin"
              type="checkbox"
              class="rounded text-primary focus:ring-primary"
              ${user.isAdmin ? 'checked' : ''}
              ${username === 'admin' ? 'disabled' : ''}
            />
            <label for="is-admin" class="text-sm">
              É administrador
            </label>
          </div>
          
          <div class="dialog-footer mt-6">
            <button type="button" class="btn btn-outline" id="cancel-user-btn">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" id="save-user-btn">
              Salvar
            </button>
          </div>
        </form>
        
        <button class="dialog-close" id="close-user-modal-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">Fechar</span>
        </button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', editUserFormHTML);
  
  // Add event listeners
  document.getElementById('user-form').addEventListener('submit', updateUser);
  document.getElementById('cancel-user-btn').addEventListener('click', closeUserForm);
  document.getElementById('close-user-modal-btn').addEventListener('click', closeUserForm);
}

function closeUserForm() {
  const userForm = document.getElementById('user-form-modal');
  if (userForm) {
    userForm.remove();
  }
}

function addUser(e) {
  e.preventDefault();
  
  const username = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;
  const canEdit = document.getElementById('can-edit').checked;
  const isAdmin = document.getElementById('is-admin').checked;
  
  // Validate inputs
  if (!username || !password) {
    showToast({
      title: 'Erro',
      description: 'Usuário e senha são obrigatórios',
      type: 'error'
    });
    return;
  }
  
  // Check if username already exists
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  if (users.some(u => u.username === username)) {
    showToast({
      title: 'Erro',
      description: 'Este nome de usuário já existe',
      type: 'error'
    });
    return;
  }
  
  // Add new user
  const newUser = {
    username,
    password,
    canEdit,
    isAdmin
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  showToast({
    title: 'Usuário adicionado',
    description: 'Novo usuário criado com sucesso',
    type: 'success'
  });
  
  closeUserForm();
  closeAdminPanel();
  showAdminPanel(); // Refresh admin panel
}

function updateUser(e) {
  e.preventDefault();
  
  const form = e.target;
  const originalUsername = form.dataset.editUsername;
  const newUsername = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;
  const canEdit = document.getElementById('can-edit').checked;
  const isAdmin = document.getElementById('is-admin').checked;
  
  // Validate inputs
  if (!newUsername) {
    showToast({
      title: 'Erro',
      description: 'Nome de usuário é obrigatório',
      type: 'error'
    });
    return;
  }
  
  // Get users and find user to update
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  const userIndex = users.findIndex(u => u.username === originalUsername);
  
  if (userIndex === -1) {
    showToast({
      title: 'Erro',
      description: 'Usuário não encontrado',
      type: 'error'
    });
    return;
  }
  
  // Check if new username already exists (and it's not the same user)
  if (newUsername !== originalUsername && users.some(u => u.username === newUsername)) {
    showToast({
      title: 'Erro',
      description: 'Este nome de usuário já existe',
      type: 'error'
    });
    return;
  }
  
  // Update user
  users[userIndex] = {
    ...users[userIndex],
    username: newUsername,
    canEdit: originalUsername === 'admin' ? true : canEdit,
    isAdmin: originalUsername === 'admin' ? true : isAdmin
  };
  
  // Update password if provided
  if (password) {
    users[userIndex].password = password;
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  // If current user was updated, update session storage too
  if (currentUser.username === originalUsername) {
    currentUser = users[userIndex];
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }
  
  showToast({
    title: 'Usuário atualizado',
    description: 'Alterações salvas com sucesso',
    type: 'success'
  });
  
  closeUserForm();
  closeAdminPanel();
  showAdminPanel(); // Refresh admin panel
}

function deleteUser(username) {
  // Confirm before deleting
  if (!confirm(`Tem certeza que deseja excluir o usuário "${username}"?`)) {
    return;
  }
  
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  const filteredUsers = users.filter(u => u.username !== username);
  
  if (filteredUsers.length === users.length) {
    showToast({
      title: 'Erro',
      description: 'Usuário não encontrado',
      type: 'error'
    });
    return;
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredUsers));
  
  showToast({
    title: 'Usuário excluído',
    description: 'O usuário foi removido com sucesso',
    type: 'success'
  });
  
  closeAdminPanel();
  showAdminPanel(); // Refresh admin panel
}

// Event Listeners
function setupEventListeners() {
  const prevMonthBtn = document.getElementById('prev-month-btn');
  const nextMonthBtn = document.getElementById('next-month-btn');
  const todayBtn = document.getElementById('today-btn');
  const monthViewBtn = document.getElementById('month-view-btn');
  const weekViewBtn = document.getElementById('week-view-btn');
  const addEventBtn = document.getElementById('add-event-btn');
  const addEventEmptyBtn = document.getElementById('add-event-empty');
  const mobileAddEventBtn = document.getElementById('mobile-add-event-btn');
  const eventForm = document.getElementById('event-form');
  const cancelEventBtn = document.getElementById('cancel-event-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  
  prevMonthBtn.addEventListener('click', handlePrevMonth);
  nextMonthBtn.addEventListener('click', handleNextMonth);
  todayBtn.addEventListener('click', handleToday);
  monthViewBtn.addEventListener('click', () => handleViewChange('month'));
  weekViewBtn.addEventListener('click', () => handleViewChange('week'));
  addEventBtn.addEventListener('click', handleAddEvent);
  addEventEmptyBtn.addEventListener('click', handleAddEvent);
  mobileAddEventBtn.addEventListener('click', handleAddEvent);
  eventForm.addEventListener('submit', handleSaveEvent);
  cancelEventBtn.addEventListener('click', closeModal);
  closeModalBtn.addEventListener('click', closeModal);
}

// Calendar Navigation
function handlePrevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function handleNextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

function handleToday() {
  currentDate = new Date();
  renderCalendar();
}

function handleViewChange(view) {
  currentView = view;
  const monthViewEl = document.getElementById('month-view');
  const weekViewEl = document.getElementById('week-view');
  const monthViewBtn = document.getElementById('month-view-btn');
  const weekViewBtn = document.getElementById('week-view-btn');
  
  if (view === 'month') {
    monthViewEl.classList.remove('hidden');
    weekViewEl.classList.add('hidden');
    monthViewBtn.classList.add('active');
    monthViewBtn.classList.remove('btn-ghost');
    weekViewBtn.classList.remove('active');
    weekViewBtn.classList.add('btn-ghost');
  } else {
    monthViewEl.classList.add('hidden');
    weekViewEl.classList.remove('hidden');
    monthViewBtn.classList.remove('active');
    monthViewBtn.classList.add('btn-ghost');
    weekViewBtn.classList.add('active');
    weekViewBtn.classList.remove('btn-ghost');
  }
  
  renderCalendar();
}

// Render Calendar
function renderCalendar() {
  // Format and display current month/year
  const monthYearStr = formatDate(currentDate, { month: 'long', year: 'numeric' });
  document.getElementById('current-month-year').textContent = monthYearStr;
  
  if (currentView === 'month') {
    renderMonthView();
  } else {
    renderWeekView();
  }
  
  renderUpcomingEvents();
}

// Month View Rendering
function renderMonthView() {
  const monthViewEl = document.getElementById('month-view');
  
  // Get first and last day of month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Calculate days to display
  let startDay = firstDay.getDay() - 1; // Adjust for week starting on Monday
  if (startDay === -1) startDay = 6; // Sunday becomes the 7th day
  
  // Create HTML structure
  let calendarHTML = `
    <div class="grid grid-cols-7 gap-2">
      <div class="text-center font-medium text-gray-500 py-2">Seg</div>
      <div class="text-center font-medium text-gray-500 py-2">Ter</div>
      <div class="text-center font-medium text-gray-500 py-2">Qua</div>
      <div class="text-center font-medium text-gray-500 py-2">Qui</div>
      <div class="text-center font-medium text-gray-500 py-2">Sex</div>
      <div class="text-center font-medium text-gray-500 py-2">Sáb</div>
      <div class="text-center font-medium text-gray-500 py-2">Dom</div>
  `;
  
  // Add empty cells for prefix days
  for (let i = 0; i < startDay; i++) {
    calendarHTML += `<div class="p-2"></div>`;
  }
  
  // Create day cells
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const hasEvent = hasEventOnDate(date);
    const isCurrentDay = isToday(date);
    
    calendarHTML += `
      <div class="p-2 h-24 border border-gray-100 calendar-day
        ${isCurrentDay ? 'today' : ''}
        ${hasEvent ? 'has-event' : ''}"
        data-date="${date.toISOString()}"
      >
        <div class="text-right mb-1">
          ${day}
        </div>
        <div class="text-xs">
    `;
    
    // Add events for this day
    const dayEvents = events.filter(event => isSameDay(new Date(event.date), date));
    dayEvents.slice(0, 2).forEach(event => {
      calendarHTML += `
        <div class="truncate text-xs p-1 mb-1 rounded bg-opacity-20
          ${getEventCategoryClass(event.category)}"
          data-event-id="${event.id}"
        >
          ${event.title}
        </div>
      `;
    });
    
    // Show indicator for more events
    if (dayEvents.length > 2) {
      calendarHTML += `
        <div class="text-xs text-gray-500 text-center">
          +${dayEvents.length - 2} mais
        </div>
      `;
    }
    
    calendarHTML += `
        </div>
      </div>
    `;
  }
  
  calendarHTML += `</div>`;
  monthViewEl.innerHTML = calendarHTML;
  
  // Add event listeners to day cells
  const dayCells = monthViewEl.querySelectorAll('.calendar-day[data-date]');
  dayCells.forEach(cell => {
    cell.addEventListener('click', () => {
      const clickedDate = new Date(cell.dataset.date);
      handleDateClick(clickedDate);
    });
  });
  
  // Add event listeners to event items
  const eventItems = monthViewEl.querySelectorAll('[data-event-id]');
  eventItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const event = events.find(event => event.id === item.dataset.eventId);
      if (event) {
        handleEventClick(event);
      }
    });
  });
}

// Week View Rendering
function renderWeekView() {
  const weekViewEl = document.getElementById('week-view');
  
  // Calculate the start of the week (Monday) and end (Sunday)
  const today = new Date(currentDate);
  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1; // adjust when day is sunday
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  // Create day list from Monday to Sunday
  const daysList = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    daysList.push(date);
  }
  
  // Create HTML structure
  let weekHTML = `
    <div class="grid grid-cols-7 gap-2">
  `;
  
  // Add day headers
  daysList.forEach(date => {
    const isCurrentDay = isToday(date);
    const dayName = formatDate(date, { weekday: 'short' });
    const dayNum = date.getDate();
    
    weekHTML += `
      <div class="text-center ${isCurrentDay ? 'font-bold text-blue-700' : 'text-gray-500'}">
        <div>${dayName}</div>
        <div class="${ isCurrentDay ? '' : ''}">
          ${dayNum}
        </div>
      </div>
    `;
  });
  
  weekHTML += `</div><div class="mt-6 grid grid-cols-1 gap-4">`;
  
  // Add events for each day
  let hasEvents = false;
  daysList.forEach(day => {
    const dayEvents = events.filter(event => isSameDay(new Date(event.date), day));
    
    if (dayEvents.length === 0) return;
    
    hasEvents = true;
    const formattedDate = formatDate(day, { weekday: 'long', day: 'numeric', month: 'long' });
    
    weekHTML += `
      <div class="animate-fade-in">
        <h3 class="font-medium mb-2 ${isToday(day) ? 'text-blue-700' : ''}">
          ${formattedDate}
        </h3>
        <div class="space-y-2">
    `;
    
    dayEvents.forEach(event => {
      weekHTML += `
        <div class="event-item category-${event.category} animate-fade-in cursor-pointer" data-event-id="${event.id}">
          <div class="flex justify-between">
            <h4 class="font-medium">${event.title}</h4>
            <span class="text-sm text-gray-500">
              ${formatTime(new Date(event.date))}
            </span>
          </div>
          <p class="text-sm text-gray-600 truncate">${event.description || ''}</p>
        </div>
      `;
    });
    
    weekHTML += `</div></div>`;
  });
  
  if (!hasEvents) {
    weekHTML += `
      <div class="text-center py-10 text-gray-500">
        <p>Não há eventos nesta semana.</p>
        <button class="btn btn-ghost mt-2 text-primary week-add-event">
          Adicionar evento
        </button>
      </div>
    `;
  }
  
  weekHTML += `</div>`;
  weekViewEl.innerHTML = weekHTML;
  
  // Add event listeners to event items
  const eventItems = weekViewEl.querySelectorAll('[data-event-id]');
  eventItems.forEach(item => {
    item.addEventListener('click', () => {
      const event = events.find(event => event.id === item.dataset.eventId);
      if (event) {
        handleEventClick(event);
      }
    });
  });
  
  // Add event listener to empty week add button
  const weekAddEventBtn = weekViewEl.querySelector('.week-add-event');
  if (weekAddEventBtn) {
    weekAddEventBtn.addEventListener('click', handleAddEvent);
  }
}

// Render upcoming events sidebar
function renderUpcomingEvents() {
  const upcomingEventsContainer = document.getElementById('upcoming-events');
  const today = new Date();
  const upcomingEvents = [...events]
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  // Group events by date
  const eventsByDate = {};
  upcomingEvents.forEach(event => {
    const date = new Date(event.date);
    const dateKey = formatDate(date, { year: 'numeric', month: '2-digit', day: '2-digit' });
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });
  
  if (Object.keys(eventsByDate).length > 0) {
    let eventsHTML = '';
    
    Object.entries(eventsByDate).forEach(([dateKey, dateEvents]) => {
      const eventDate = new Date(dateEvents[0].date);
      const isDateToday = isSameDay(eventDate, today);
      
      eventsHTML += `
        <div class="mb-4 last:mb-0">
          <h3 class="text-sm font-medium text-gray-500 mb-2">
            ${isDateToday ? 'Hoje' : formatDate(eventDate, { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          <div class="space-y-2">
      `;
      
      dateEvents.forEach(event => {
        eventsHTML += `
          <div class="event-item category-${event.category} cursor-pointer" data-event-id="${event.id}">
            <div class="flex items-start">
              <div class="w-3 h-3 rounded-full mt-1 mr-2 ${getEventCategoryColor(event.category)}"></div>
              <div class="flex-1">
                <div class="font-medium">${event.title}</div>
                <div class="text-xs text-gray-500">
                  ${formatTime(new Date(event.date))}
                </div>
                ${event.description ? `
                  <p class="text-sm text-gray-600 line-clamp-1 mt-1">
                    ${event.description}
                  </p>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      });
      
      eventsHTML += `</div></div>`;
    });
    
    upcomingEventsContainer.innerHTML = eventsHTML;
    
    // Add event listeners to event items
    const eventItems = upcomingEventsContainer.querySelectorAll('[data-event-id]');
    eventItems.forEach(item => {
      item.addEventListener('click', () => {
        const event = events.find(event => event.id === item.dataset.eventId);
        if (event) {
          handleEventClick(event);
        }
      });
    });
  } else {
    upcomingEventsContainer.innerHTML = `
      <div class="py-8 text-center text-gray-500">
        <p>Nenhum evento próximo</p>
        <button class="btn btn-ghost mt-2 text-primary" id="add-event-empty">
          Adicionar evento
        </button>
      </div>
    `;
    
    document.getElementById('add-event-empty').addEventListener('click', handleAddEvent);
  }
}

// Event Management
function handleAddEvent() {
  // Check if user can edit
  if (!currentUser?.canEdit) {
    showToast({
      title: 'Acesso negado',
      description: 'Você não tem permissão para adicionar eventos',
      type: 'error'
    });
    return;
  }
  
  selectedDate = new Date();
  eventToEdit = null;
  openEventForm();
}

function handleDateClick(date) {
  // Check if user can edit
  if (!currentUser?.canEdit) {
    showToast({
      title: 'Acesso negado',
      description: 'Você não tem permissão para adicionar eventos',
      type: 'error'
    });
    return;
  }
  
  selectedDate = date;
  eventToEdit = null;
  openEventForm();
}

function handleEventClick(event) {
  if (currentUser?.canEdit) {
    eventToEdit = event;
    selectedDate = new Date(event.date);
    openEventForm();
  } else {
    // For non-editors, just show event details
    showEventDetails(event);
  }
}

function showEventDetails(event) {
  const eventDate = new Date(event.date);
  const formattedDate = formatDate(eventDate, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formattedTime = formatTime(eventDate);
  
  const eventDetailsHTML = `
    <div id="event-details-modal" class="dialog open">
      <div class="dialog-overlay"></div>
      <div class="dialog-content max-w-md mx-auto">
        <div class="dialog-header">
          <div class="dialog-title category-${event.category}">
            ${event.title}
          </div>
        </div>
        
        <div class="space-y-4 py-2">
          <div class="flex items-start">
            <div>
              <div class="text-gray-500">Data: ${formattedDate}</div>
              <div class="text-gray-500">Horas: ${formattedTime}</div>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="text-gray-500">
              ${EVENT_CATEGORIES.find(cat => cat.value === event.category)?.label || 'Outro'}
            </div>
          </div>
          
          ${event.description ? `
            <div class="border-t pt-4 mt-4">
              <div class="text-gray-500">
                ${event.description}
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="dialog-footer mt-6">
          <button type="button" class="btn btn-primary" id="close-event-details-btn">
            Fechar
          </button>
        </div>
        
        <button class="dialog-close" id="close-event-details-modal-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">Fechar</span>
        </button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', eventDetailsHTML);
  
  // Add event listeners
  document.getElementById('close-event-details-btn').addEventListener('click', closeEventDetails);
  document.getElementById('close-event-details-modal-btn').addEventListener('click', closeEventDetails);
}

function closeEventDetails() {
  const eventDetailsModal = document.getElementById('event-details-modal');
  if (eventDetailsModal) {
    eventDetailsModal.remove();
  }
}

function openEventForm() {
  const eventFormModal = document.getElementById('event-form-modal');
  const titleInput = document.getElementById('event-title');
  const descriptionInput = document.getElementById('event-description');
  const dateInput = document.getElementById('event-date');
  const timeInput = document.getElementById('event-time');
  const categorySelect = document.getElementById('event-category');
  const notificationCheckbox = document.getElementById('event-notification');
  const eventFormTitle = document.getElementById('event-form-title');
  const saveEventBtn = document.getElementById('save-event-btn');
  const deleteButtonContainer = document.getElementById('delete-button-container');
  
  if (eventToEdit) {
    eventFormTitle.textContent = 'Editar Evento';
    saveEventBtn.textContent = 'Atualizar';
    
    titleInput.value = eventToEdit.title;
    descriptionInput.value = eventToEdit.description || '';
    
    const eventDate = new Date(eventToEdit.date);
    dateInput.value = formatDate(eventDate, { year: 'numeric', month: '2-digit', day: '2-digit' }, '-');
    timeInput.value = formatTime(eventDate, true);
    
    categorySelect.value = eventToEdit.category;
    notificationCheckbox.checked = eventToEdit.notification;
    
    // Add delete button
    deleteButtonContainer.innerHTML = `
      <button 
        type="button" 
        class="btn btn-destructive mr-auto" 
        id="delete-event-btn"
      >
        Excluir
      </button>
    `;
    
    document.getElementById('delete-event-btn').addEventListener('click', () => {
      handleDeleteEvent(eventToEdit.id);
    });
  } else {
    eventFormTitle.textContent = 'Novo Evento';
    saveEventBtn.textContent = 'Adicionar';
    
    titleInput.value = '';
    descriptionInput.value = '';
    dateInput.value = formatDate(selectedDate, { year: 'numeric', month: '2-digit', day: '2-digit' }, '-');
    timeInput.value = '08:00';
    categorySelect.value = 'homework';
    notificationCheckbox.checked = true;
    
    deleteButtonContainer.innerHTML = '';
  }
  
  eventFormModal.classList.add('open');
  titleInput.focus();
}

async function handleSaveEvent(e) {
  e.preventDefault();
  
  // Check if user can edit
  if (!currentUser?.canEdit) {
    showToast({
      title: 'Acesso negado',
      description: 'Você não tem permissão para adicionar ou editar eventos',
      type: 'error'
    });
    return;
  }
  
  const titleInput = document.getElementById('event-title');
  const descriptionInput = document.getElementById('event-description');
  const dateInput = document.getElementById('event-date');
  const timeInput = document.getElementById('event-time');
  const categorySelect = document.getElementById('event-category');
  const notificationCheckbox = document.getElementById('event-notification');
  
  // Validate inputs
  if (!titleInput.value.trim()) {
    showToast({
      title: 'Erro',
      description: 'O título do evento é obrigatório',
      type: 'error'
    });
    return;
  }
  
  // Combine date and time for the event
  const eventDate = new Date(`${dateInput.value}T${timeInput.value}`);
  
  const newEvent = {
    id: eventToEdit?.id || generateUUID(),
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    date: eventDate.toISOString(),
    category: categorySelect.value,
    notification: notificationCheckbox.checked
  };
  
  if (eventToEdit) {
    await handleDeleteEvent(eventToEdit.id); // remove o anterior
  }

  await fetch('http://localhost:3000/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newEvent)
  });

  
  closeModal();
  loadEvents();
}

async function handleDeleteEvent(id) {
  await fetch(`http://localhost:3000/events/${id}`, { method: 'DELETE' });
  closeModal();
  loadEvents();
}

function closeModal() {
  const eventFormModal = document.getElementById('event-form-modal');
  eventFormModal.classList.remove('open');
}

// Notifications
function initNotifications() {
  // Check for events happening in the next 30 minutes every minute
  setInterval(checkForUpcomingEvents, 60000);
  
  // Also check once on load
  setTimeout(checkForUpcomingEvents, 1000);
}

function checkForUpcomingEvents() {
  const now = new Date();
  // Check for events happening in the next 30 minutes
  const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
  
  events.forEach(event => {
    const eventDate = new Date(event.date);
    
    // If event is within next 30 mins and notification not shown yet
    if (
      event.notification && 
      eventDate > now && 
      eventDate <= thirtyMinutesLater && 
      !shownNotifications.has(event.id)
    ) {
      showToast({
        title: event.title,
        description: `Evento em ${Math.floor((eventDate.getTime() - now.getTime()) / 60000)} minutos - ${formatTime(eventDate)}`,
        duration: 5000,
        type: 'info'
      });
      
      shownNotifications.add(event.id);
    }
  });
}

// Toast Notifications
function showToast({ title, description, duration = 3000, type = 'info' }) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div>
      <div class="toast-title">${title}</div>
      ${description ? `<div class="toast-description">${description}</div>` : ''}
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Remove toast after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Data Persistence
async function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); // opcional como cache
}

async function loadEvents() {
  const response = await fetch('http://localhost:3000/events');
  events = await response.json();
  renderCalendar();
}

// Utility Functions
function hasEventOnDate(date) {
  return events.some(event => isSameDay(new Date(event.date), date));
}

function isSameDay(date1, date2) {
  return date1.getDate() === date2.getDate() && 
         date1.getMonth() === date2.getMonth() && 
         date1.getFullYear() === date2.getFullYear();
}

function isToday(date) {
  const today = new Date();
  return isSameDay(date, today);
}

function getEventCategoryClass(category) {
  switch(category) {
    case 'homework': return 'bg-blue-100 text-blue-800';
    case 'exam': return 'bg-red-100 text-red-800';
    case 'activity': return 'bg-green-100 text-green-800';
    case 'meeting': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getEventCategoryColor(category) {
  switch(category) {
    case 'homework': return 'bg-blue-500';
    case 'exam': return 'bg-red-500';
    case 'activity': return 'bg-green-500';
    case 'meeting': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
}

// Format date according to locale and options
function formatDate(date, options = {}, separator = ' ') {
  if (!date) return '';
  
  try {
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  } catch (e) {
    console.error('Error formatting date:', e);
    return '';
  }
}

// Format time from date object
function formatTime(date, forInput = false) {
  if (!date) return '';
  
  try {
    if (forInput) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } else {
      return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);
    }
  } catch (e) {
    console.error('Error formatting time:', e);
    return '';
  }
}

// Generate UUID for unique IDs
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}