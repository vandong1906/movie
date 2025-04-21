import axios from "axios";


interface User {
    email: string;
    User_Name: string;
    password: string;
}
export interface Iregister {
    User_Name: string;
    password: string;
    mail: string;
}

function CallUser() {
    const create= async (User:Iregister)=> {
       const response=await axios.post("/v1/user/register", User, {
        withCredentials: true,
       });
       console.log(response);
       return response;
    }
    const login=async ({email , password} :{email:string,password :string})=> {
        
        const response = await axios.post("/api/users/login", {
            email,
            password
        });
        return response.data;
    }
     const loginGoogle = async (idToken: string) => {
            const response = await axios.post(" http://localhost:3000/api/admins/google", { idToken, withCredentials: true });
            return response.data;
     
    };
    const update= async (User:User)=> {
        await axios.post("/v1/user/update", User);
    }
    return {create, login, update ,loginGoogle};
}

export default CallUser;