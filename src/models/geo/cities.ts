//https://www.npmjs.com/package/sequelize-typescript#one-to-many
import { Model, Table, Column } from 'sequelize-typescript'
@Table({
    tableName: 'departure_city'
})
export default class Source_City extends Model<Source_City> {
    @Column({
        comment: '自增ID',
        autoIncrement: true,
        primaryKey: true,
    })
    uid: number

    @Column({
        comment: '城市名称',
    })
    name: string

}
@Table({tableName:'dest_city'})
export class Destination_City {

}
@Table({tableName:'city_info'})
export class City_Info {

}