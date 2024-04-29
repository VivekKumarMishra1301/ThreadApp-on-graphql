import { prismaClient } from "../config/db"
import {createHmac,randomBytes} from 'node:crypto'
import { User } from "../graphql/user"
import JWT from 'jsonwebtoken'
const JWT_SECRET='fjhdjhguhduvbduvbbdyubhfuehuhuyfhyushyufhuerifuhsdjshufheuhfuhdjjkshliurerguhuwebgekhsehrshhj'
export interface CreateUserPayload{
    firstName: string
    lastName?: string
    email: string
    password: string
}


export interface GetUserTokenPayload{
    email: string;
    password: string;
}


class UserService{


    private static generateHash(salt: string, password: string) {
         const hashedPassword =createHmac('sha256',salt).update(password).digest('hex');
        return hashedPassword;
    }




    public static createUser(payload: CreateUserPayload) {
        const {firstName,lastName,email,password} = payload
        const salt = randomBytes(32).toString("hex");
        const hashedPassword =createHmac('sha256',salt).update(password).digest('hex');
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                salt,
                password:hashedPassword
            }
        })
    }

    private static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email } });
    }
  

    public static async getUserToken(payload: GetUserTokenPayload) {
        const { email, password } = payload;
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            throw new Error('User Not Found');
        }

        const userSalt = user.salt||"";
        // console.log(userSalt)
        const userHashedPassword = UserService.generateHash(userSalt, password);

        if (userHashedPassword !== user.password) {
            throw new Error('Incorrect Password')
        }


        const token=JWT.sign({id:user.id,email:user.email},JWT_SECRET)
        return token;


    }
   
    public static getUserByID(id: string) {
        return prismaClient.user.findUnique({where:{id}})
    }

    public static decodeJWTToken(token: string) {
        // console.log(token);
        return JWT.verify(token,JWT_SECRET)
    }



}

export default UserService;