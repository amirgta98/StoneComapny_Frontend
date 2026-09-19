/**
 * Attributes feature.
 *
 * Manages extensible product attributes, surface finishes, ASTM lab specs,
 * and variant drivers for the stone factory platform.
 */

export * from "./types";
export * from "./data/mock-attributes";
export * from "./stores/attributes-store";
export { AttributesManagerView } from "./components/manager/attributes-manager-view";
export { AttributeFormDialog } from "./components/manager/attribute-form-dialog";
export { AttributeDeleteDialog } from "./components/manager/attribute-delete-dialog";
export { AttributePresetsDialog } from "./components/manager/attribute-presets-dialog";