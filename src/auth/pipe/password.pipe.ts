import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common';
import { In } from 'typeorm';

@Injectable()
export class PasswordPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value.length > 8) {
            throw new BadRequestException('비밀번호는 8자 이하로 입력해주세요.');
        }

        return value.toString();
    }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
    constructor(private readonly length: number,
        private readonly subject: string) {

    }

    transform(value: any, metadata: ArgumentMetadata) {
        if (value.toString().length > this.length) {
            throw new BadRequestException(`${this.subject}는 최대 ${this.length}자 이하로 입력해주세요.`);
        }

        return value.toString();
    }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
    constructor(private readonly length: number,
        private readonly subject: string) {

    }

    transform(value: any, metadata: ArgumentMetadata) {
        if (value.toString().length < this.length) {
            throw new BadRequestException(`최소 ${this.length}자 이상으로 입력해주세요.`);
        }

        return value.toString();
    }
}