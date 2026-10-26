import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Textarea from "@cloudscape-design/components/textarea";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useNotify } from "../app/notify";
import { useCreateItem } from "../features/items/hooks";
import { validateNewItem, type ItemFormErrors } from "../features/items/validation";

export default function CreateItemPage() {
  const navigate = useNavigate();
  const notify = useNotify();
  const create = useCreateItem();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<ItemFormErrors>({});

  function submit(event: FormEvent) {
    event.preventDefault();
    const { value, errors: found } = validateNewItem(name, description);
    setErrors(found);
    if (!value) return;
    create.mutate(value, {
      onSuccess: (item) => {
        notify({ type: "success", content: `Item ${item.name} criado.` });
        void navigate(`/itens/${item.id}`);
      },
    });
  }

  return (
    <form onSubmit={submit} noValidate>
      <Form
        header={
          <Header variant="h1" description="Exemplo de formulário: validação no campo antes de chamar a API.">
            Novo item
          </Header>
        }
        errorText={create.error ? `A API recusou o item: ${create.error.message}` : undefined}
        errorIconAriaLabel="Erro"
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none" variant="link" onClick={() => void navigate("/itens")}>
              Cancelar
            </Button>
            <Button variant="primary" loading={create.isPending}>
              Criar item
            </Button>
          </SpaceBetween>
        }
      >
        <Container header={<Header variant="h2">Dados do item</Header>}>
          <SpaceBetween size="l">
            <FormField label="Nome" constraintText="De 1 a 80 caracteres." errorText={errors.name}>
              <Input
                value={name}
                onChange={({ detail }) => setName(detail.value)}
                placeholder="Caderno"
                ariaRequired
              />
            </FormField>
            <FormField
              label={
                <span>
                  Descrição <i>— opcional</i>
                </span>
              }
              constraintText="Até 300 caracteres."
              errorText={errors.description}
            >
              <Textarea
                value={description}
                onChange={({ detail }) => setDescription(detail.value)}
                placeholder="Capa dura, 200 folhas"
              />
            </FormField>
          </SpaceBetween>
        </Container>
      </Form>
    </form>
  );
}
