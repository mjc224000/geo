//https://echarts.baidu.com/examples/data/asset/data/flare.json
//https://www.npmjs.com/package/sequelize-typescript#multiple-relations-of-same-models
import {Model, Table, Column, ForeignKey, BelongsTo, HasMany, HasOne} from "sequelize-typescript"
import {TreeData} from "geo";


@Table({tableName: 'tree'})
export default class TreeModel extends Model<TreeModel> {
    @Column({
        comment: '自增ID',
        autoIncrement: true,
        primaryKey: true
    })
    uid: number
    @Column({comment: '名称'})
    name: string
    @Column({comment: '父级'})
    @ForeignKey(() => TreeModel)
    fatherId: number

    @BelongsTo(() => TreeModel, 'fatherId')
    father: TreeModel

    @HasMany(() => TreeModel, 'fatherId')
    children: TreeModel[]
}

export async function createNode(childName: string, fatherName: string) {
    let [model, created] = await TreeModel.findOrCreate({where: {name: 'the one'}})
    let [childInstance, cc] = await TreeModel.findOrCreate({where: {name: 'jesus'}});
    let [json, jc] = await TreeModel.findOrCreate({where: {name: 'json'}});
    await model.$add('children', childInstance);
    await childInstance.$add('children', json);
    let children = await model.$get('children', {raw: true});
    let data = await TreeModel.findAll({raw: true})
    //  await deleteNode(childInstance.name);
    data = await TreeModel.findAll({raw: true})
}

export async function add(node: TreeData): Promise<Boolean> {
    let [instance, created] = await TreeModel.findOrCreate({where: {name: node.name}});
    let fatherName = node.fatherName;
    let [fIns, fCreated] = await TreeModel.findOrCreate({where: {name: fatherName}});
    await fIns.$add('children', instance);
    return instance ? true : false
}

export async function getTree(): Promise<any> {
    let tree = await TreeModel.findAll({raw: true});

    let orphan: Array<TreeModel> = [];
    let root = {name: 'root', children: orphan};
    tree.forEach(function (item: TreeModel) {
        let fatherId = item.fatherId;
        if (!fatherId) {
            orphan.push(item)
        } else {
            let father = tree.find((f) => f.uid === fatherId);
            father.children = father.children || [];
            father.children.push(item);
        }
    })
    console.log(root);
    return root;
}

export async function deleteNode(nodeName: string) {
    let instance = await TreeModel.findOne({where: {name: nodeName}});
    if (instance) {
        let children: Array<any> = await instance.$get('children');
        children.length && await instance.$remove('children', children);
        await TreeModel.destroy({where: {name: nodeName}});
        return true
    }
    return false

}

export async function updateTree(treeData: TreeData):Promise<any> {
    let {uid, name, fatherName} = treeData;
    //找爸爸
    let father = await TreeModel.findOne({where: {name: fatherName}, raw: true});
    if (father) {
        let ret = father && await TreeModel.update({name, fatherId: father.uid}, {where: {uid}});
    } else {
        await TreeModel.update({name}, {where: {uid}});
    }

    return []
}

export async function setFather(fatherName: string, childName: string): Promise<Boolean> {
    let father = await TreeModel.find({where: {name: fatherName}});
    let child = await TreeModel.find({where: {name: childName}});
    if (child && father) {
        await father.$add('children', child);
        return true
    }
    return false
}