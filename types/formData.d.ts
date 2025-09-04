declare global {
  type FormDataValue =
    | {
        uri: string;
        name: string;
        type: string;
      }
    | string
    | Blob;

  interface FormData {
    append(name: string, value: FormDataValue, fileName?: string): void;

    set(name: string, value: FormDataValue, fileName?: string): void;
  }
}

export {};
