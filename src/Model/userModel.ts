interface User {
    id: number,
    username: string,
    email: string,
    password: string,
    role: "user" | "admin"
}

export default User