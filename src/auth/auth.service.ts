import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {}
    /**
     * 토큰을 사용하게 되는 방식
     * 
     * 1) 사용자가 로그인 또는 회원가입을 진행하면
     *    accessToken, refreshToken을 발급한다.
     * 
     * 2) 로그인 할 때는 Basic 토큰과 함께 요청을 보낸다.
     *    Basic 토큰은 '이메일:비밀번호'를 base64로 인코딩한 값이다.
     *    ex) {authorization: 'Basic {token}'}
     * 
     * 3) 아무나 접근할 수 없는 정보 (private route)를 접근 할 때는
     *    accessToken을 헤더에 담아서 보낸다.
     *    ex) {authorization: 'Bearer {token}'}
     * 
     * 4) 토큰과 요청을 함께 받은 서버는 토큰 검증을 통해 현재 요청을 보낸
     *    사용자가 누구인지 확인한다.
     *    예를 들어서 현재 로그인한 사용자가 작성한 포스트만 가져오려면
     *    토큰의 sub값에 입력돼있는 사용자의 포스트만 따로 필터링 할 수 있다.
     *    특정 사용자의 토큰이 없다면 다른 사용자의 데이터를 접근 못한다.
     * 
     * 5) 모든 토큰은 만료 기간이 있다. 만료기간이 지나면 새로 토큰을 발급받아야 한다.
     *    그렇지 않으면 jwtService.verify()에서 인증이 통과되지 않는다.
     *    그러니 access토큰을 새로 발급 받을 수 있는 /auth/token/access와
     *    refresh토큰을 새로 발급 받을 수 있는 /auth/token/refresh를 만들어야 한다.
     * 
     * 6) 토큰이 만료되면 각각의 토큰을 새로 발급받을 수 있는 엔트포인트에 요청을 해서
     *    새로운 토큰을 발급받고 새로운 토큰을 사용해서 private route에 접근한다.
     */

    /**
     * Header로부터 토큰을 받을 때
     * 
     * {authorization: 'Basic {token}'
     * {authorization: 'Bearer {token}'
     */
    extractTokenFromHeader(header: string, isBearer: boolean) {
        const splitToken = header.split(' ');

        const prefix = isBearer ? 'Bearer' : 'Basic';

        if(splitToken.length !== 2 || splitToken[0] !== prefix){
            throw new UnauthorizedException('토큰이 올바르지 않습니다.');
        }

        const token = splitToken[1];

        return token;
    }

    /**
     * Basic fdsajklfhdjslafhuidshajk
     * 
     * 1. fdsajklfhdjslafhuidshajk -> email:password
     * 2. email:password -> [email, password]
     * 3. {email: email, password: password}
     */
    decodeBasicToken(base64String: string){
        const decoded = Buffer.from(base64String, 'base64').toString('utf-8');

        const split = decoded.split(':');

        if(split.length !== 2){
            throw new UnauthorizedException('토큰이 올바르지 않습니다.');
        }

        const email = split[0];
        const password = split[1];

        return {
            email,
            password,
        }
    }

    verifyToken(token: string){
        try {
            return this.jwtService.verify(token, {
                secret: JWT_SECRET,
            });
        } catch (e) {
            throw new UnauthorizedException('토큰이 만료되었거나 잘못된 토큰입니다.')
        }
        
    }

    rotateToken(token: string, isRefreshToken: boolean){
        const decoded = this.jwtService.verify(token, {
            secret: JWT_SECRET,
        });
        
        /**
         * sub: id
         * email: email
         * type: 'access' | 'refresh'
         */
        if(decoded.type !== 'refresh'){
            throw new UnauthorizedException('토큰 재발급은 RefreshToken으로만 가능합니다.');
        }
        
        return this.signToken({
            ...decoded,
        }, isRefreshToken);
    }

    /**
     * @todo
     * 1. registerWithEmail
     *    - email, password, nickname을 입력받고 사용자를 생성한다.
     *    - 사용자 생성 후, refreshToken, accessToken을 발급한다.
     *      회원가입 후 다시 로그인을 하지 않아도 되도록 하기 위해서
     * 
     * 2. loginWithEmail
     *    - email, password를 입력받고 사용자를 검증한다.
     *    - 사용자 검증 후, refreshToken, accessToken을 발급한다.
     * 
     * 3. loginUser
     *    - 1, 2에서 필요한 accessToken과 refreshToken을 반환하는 로직
     * 
     * 4. signToken
     *    - 3에서 필요한 accessToken과 refreshToken을 sign하는 로직
     * 
     * 5. authenticateWithEmailAndPassword
     *    - 2에서 로그인을 진행할 때 필요한 기본적인 검증 진행
     *      1) 사용자가 존재하는지 확인(email)
     *      2) 비밀번호가 일치하는지 확인(password)
     *      3) 모두 통과하면 사용자 정보를 반환한다.
     *      4) loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
     */

    /**
     * Payload에 들어갈 정보
     * 
     * 1) email
     * 2) sub -> 사용자의 id
     * 3) type -> 'access' | 'refresh'
     */
    signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean){
        const payload = {
            email: user.email,
            sub: user.id,
            type: isRefreshToken ? 'refresh' : 'access',
        };

        return this.jwtService.sign(payload, {
            secret: JWT_SECRET,
            //second
            expiresIn: isRefreshToken ? 3600 : 300,
        });
    }

    loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true),
        }
    }

    async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email'|'password'>){
        /**
         * 1) 사용자가 존재하는지 확인(email)
         * 2) 비밀번호가 일치하는지 확인(password)
         * 3) 모두 통과하면 사용자 정보를 반환한다.
         */
        const existingUser = await this.usersService.getUserByEmail(user.email);

        if(!existingUser){
            throw new Error('존재하지 않는 사용자입니다.');
        }

        /**
         * param
         * 1) 입력된 비밀번호
         * 2) 기존 해시 -> 사용자 정보에 저장되어 있는 해시
         */
        const passOk = await bcrypt.compare(user.password, existingUser.password);

        if(!passOk){
            throw new Error('비밀번호가 일치하지 않습니다.');
        }

        return existingUser;

    }

    async loginWithEmail(user: Pick<UsersModel, 'email'|'password'>){
        const existingUser = await this.authenticateWithEmailAndPassword(user);

        return this.loginUser(existingUser);
    }

    async registerWithEmail(user: Pick<UsersModel, 'nickname'|'email'|'password'>){
        const hash = await bcrypt.hash(user.password, HASH_ROUNDS);

        const newUser = await this.usersService.createUser({
            ...user,
            password: hash,
        });

        return this.loginUser(newUser);

    }
}
