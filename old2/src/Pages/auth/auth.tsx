import { User } from "../../Classes/user";

export function Auth() {
  const user = new User();

  return (
    <div>
      <button onClick={user.googleAuth}>Teste</button>
    </div>
  );
}
