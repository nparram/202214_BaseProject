import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class AirlineDto {

    readonly id: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    readonly fundationDate: Date;

    @IsNotEmpty()
    @IsUrl()
    readonly webPage: string;
}