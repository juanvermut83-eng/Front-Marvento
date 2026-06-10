//obtengo data user
const userData = () => {
    try {
        return JSON.parse(localStorage.getItem('userData') || 'null');
    } catch {
        return null;
    }
};

//logOut
const logout = () => {
    localStorage.removeItem('userData');
};

const cartData = () => {
    try {
        return JSON.parse(localStorage.getItem('cartData') || '[]');
    } catch {
        return [];
    }
};

export {
    userData,
    logout,
    cartData
}
