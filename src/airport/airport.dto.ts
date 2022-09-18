import { IsDate, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class AirportDto {

    readonly id: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly code: string;

    @IsNotEmpty()
    @IsString()
    readonly country: string;

    @IsNotEmpty()
    @IsString()
    readonly city: string;
}