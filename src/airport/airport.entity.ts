import { AirlineEntity } from "../airline/airline.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AirportEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    country: string;

    @Column()
    city: string;

    @ManyToMany(() => AirlineEntity, airline => airline.airports)
    @JoinTable()
    airlines: AirlineEntity[];
}
