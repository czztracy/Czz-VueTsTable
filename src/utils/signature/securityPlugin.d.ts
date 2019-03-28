import security from './securityPlugin'
declare module "securityPlugin" {
    export default function security(obj: any): void;
}