export default () => console.log('util1')
function f() {
    console.log("f(): evaluated");
    return function (target:any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called 2");
    }
}

function g() {
    console.log("g(): evaluated");
    return function (target:any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("g(): called");
    }
}

export class C {
    @f()
    @g()
    method() {}
}