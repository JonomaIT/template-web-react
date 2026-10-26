import Alert from "@cloudscape-design/components/alert";
import Button from "@cloudscape-design/components/button";
import { useFollow } from "../app/navigation";

export default function NotFoundPage() {
  const follow = useFollow();
  return (
    <Alert
      type="info"
      header="Página não encontrada"
      action={
        <Button href="/" onFollow={follow}>
          Ir para o início
        </Button>
      }
    >
      O endereço não existe neste site.
    </Alert>
  );
}
