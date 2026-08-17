import { Field, Form } from '@base-ui/react';

export function ProfileForm() {
  return (
    <Form className="space-y-4">
      <Field.Root name="displayName">
        <Field.Label>Display name</Field.Label>
        <Field.Control required />
        <Field.Error match="valueMissing">Enter a display name.</Field.Error>
      </Field.Root>
      <button type="submit">Save</button>
    </Form>
  );
}
