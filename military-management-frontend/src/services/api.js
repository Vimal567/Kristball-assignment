import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
});

const setToken = (token) => {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
};

const auth = (email, password) =>
    api.post("/auth/login", { email, password }).then((res) => res.data);

const register = (data) =>
    api.post("/auth/register", data).then((res) => res.data);

const getPurchases = (filters = {}) =>
    api.get("/purchases", { params: filters }).then((res) => res.data);

const createPurchase = (data) =>
    api.post("/purchases", data).then((res) => res.data);

const getTransfers = (filters = {}) =>
    api.get("/transfers", { params: filters }).then((res) => res.data);

const createTransfer = (data) =>
    api.post("/transfers", data).then((res) => res.data);

const getExpenditures = (filters = {}) =>
    api.get("/expenditures", { params: filters }).then((res) => res.data);

const createExpenditure = (data) =>
    api.post("/expenditures", data).then((res) => res.data);

const getDashboardSummary = (filters = {}) =>
    api.get("/dashboard/summary", { params: filters }).then((res) => res.data);

const getBases = () =>
    api.get("/bases").then((res) => res.data);

const getAssets = () =>
    api.get("/assets").then((res) => res.data);

// Export API methods
export default {
    setToken,
    auth,
    register,
    getPurchases,
    createPurchase,
    getTransfers,
    createTransfer,
    getExpenditures,
    createExpenditure,
    getDashboardSummary,
    getBases,
    getAssets
};
