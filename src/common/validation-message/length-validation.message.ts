import { ValidationArguments } from "class-validator";

export const lengthValidationMessage = (args: ValidationArguments) => {
    /**
     * ValidationArguments의 프로퍼티들
     * 
     * 1) value: 검사하려는 값
     * 2) constraints: 데코레이터의 인자로 전달된 값
     *    args.constraints[0] -> 1
     *    args.constraints[1] -> 20
     * 3) targetName: 검사하려는 객체의 클래스 이름 - UsersModel
     * 4) object: 검사하려는 객체
     * 5) property: 검사하려는 객체의 프로퍼티 이름 - nickname
     */
    if(args.constraints.length === 2){
        return `${args.property}은 ${args.constraints[0]}글자 이상 ${args.constraints[1]}글자 이하로 입력해주세요.`;
    }else{
        return `${args.property}은 ${args.constraints[0]}글자 이상 입력해주세요.`;
    }
}