import { Header } from "./Header";

type Props = {
  children: React.ReactNode;
};

export default function BaseLayout({ children }: Props) {
  return (
    <>
      <Header />
      <div className="container main-content">{children}</div>
    </>
  );
}
