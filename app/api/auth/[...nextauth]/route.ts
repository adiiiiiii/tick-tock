// app/api/auth/[...nextauth]/route.ts
import { handlers } from "../../../auth"; // Adjust path to wherever your auth.ts is located

export const { GET, POST } = handlers;