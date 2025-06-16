export const imgBaseURL = "https://upskilling-egypt.com:3003";
export const baseURL = "https://upskilling-egypt.com:3003/api/v1";

// USERS URLS
export const USERS_URL = {
    LOGIN: "/Users/Login",
    REGISTER: "/Users/Register",
    CREATE: "/Users/Create", // Create a manager
    GET_USER: (id:number) => `/Users/${id}`, // Get user by ID
    TOGGLE_USER: (id:number) => `/Users/${id}`, // Toggle user active
    GET_ALL_USERS: "/Users", // Get and filter users
    GET_COUNT: "/Users/count", // Get users count by manager
    GET_MANAGER_USERS: "/Users/Manager", // Get users by manager
    VERIFY_ACCOUNT: "/Users/verify", // Verify user account
    GET_CURRENT_USER: "/Users/currentUser", // Get current user
    UPDATE_PROFILE: "/Users", // Update current user profile
    CHANGE_PASSWORD: "/Users/ChangePassword", // Update user password
    RESET_REQUEST: "/Users/Reset/Request", // Request reset
    RESET: "/Users/Reset", // Reset user password
};

// PROJECT URLS
export const PROJECT_URLS = {
    CREATE_PROJECT: "/Project", // Create project by manager
    GET_PROJECT: (id:number) => `/Project/${id}`, // Get project by id
    UPDATE_PROJECT: (id:number) => `/Project/${id}`, // Update project by manager
    DELETE_PROJECT: (id:number) => `/Project/${id}`, // Delete project by id
    GET_PROJECTS_BY_MANAGER: "/Project/manager", // Get projects for manager
    GET_PROJECTS_BY_EMPLOYEE: "/Project/employee", // Get projects for employee
    GET_ALL_PROJECTS: "/Project", // Get all projects in system
};

// TASK URLS
export const TASK_URLS = {
    CREATE_TASK: "/Task", // Create task by manager
    GET_ASSIGNED_TASKS: "/Task", // Get all my assigned tasks
    GET_TASKS_BY_MANAGER: "/Task/manager", // Get all tasks by manager
    GET_TASK: (id:number) => `/Task/${id}`, // Get task by id
    UPDATE_TASK: (id:number) => `/Task/${id}`, // Update task by id
    DELETE_TASK: (id:number) => `/Task/${id}`, // Delete task by id
    COUNT_TASKS: "/Task/count", // Count tasks for manager and employee
    CHANGE_STATUS: (id:number) => `/Task/${id}/change-status`, // Change task status
    GET_TASKS_BY_PROJECT: (id:number) => `/Task/project/${id}`, // Get tasks by project id
};

// PING
export const PING_URL = "/Misc/Ping"; // Check if service is working


