import { Redirect } from "expo-router";

export default function Index() {
  // ✅ Tự động chuyển đến trang welcome khi mở app
  return <Redirect href="/welcome" />;
}
