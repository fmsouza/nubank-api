import { AuthType, Context } from "../context";

export function RequiresAuth(
  ...selectedAuthTypes: AuthType[]
): (this: any, ...args: any[]) => any {
  return <This extends { context: Context }, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return
  ): ((this: This, ...args: Args) => Return) => {
    return function (this: This, ...args: Args): Return {
      const currentAuthType = this.context.authType;
      if (!selectedAuthTypes.includes(currentAuthType)) {
        throw new Error(
          `This method requires [${selectedAuthTypes.join(",")}] authentication`
        );
      }
      return target.call(this, ...args);
    };
  };
}
