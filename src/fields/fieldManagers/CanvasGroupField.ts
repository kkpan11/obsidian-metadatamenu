import MetadataMenu from "main"
import { TFile, Menu, TextComponent } from "obsidian"
import { postValues } from "src/commands/postValues"
import { FieldOptions } from "src/components/NoteFields"
import FieldCommandSuggestModal from "src/options/FieldCommandSuggestModal"
import FieldSettingsModal from "src/settings/FieldSettingsModal"
import { FieldType } from "src/types/fieldTypes"
import Field from "../Field"
import { SettingLocation } from "../FieldManager"
import AbstractCanvasBasedField from "./AbstractCanvasBasedField"

export default class CanvasGroupField extends AbstractCanvasBasedField {

    canvasPathInput: TextComponent;

    constructor(plugin: MetadataMenu, field: Field) {
        super(plugin, field, FieldType.CanvasGroup)
    }

    addFieldOption(name: string, value: string, file: TFile, location: Menu | FieldCommandSuggestModal | FieldOptions): void {
        //no field option to add for this field, it is automatically updated
    }

    async createAndOpenFieldModal(file: TFile, selectedFieldName: string, value?: string, lineNumber?: number, after?: boolean, asList?: boolean, asComment?: boolean): Promise<void> {
        await postValues(this.plugin, [{ name: this.field.name, payload: { value: "" } }], file, lineNumber, after, asList, asComment)
    }

    createDvField(dv: any, p: any, fieldContainer: HTMLElement, attrs?: { cls?: string | undefined; attr?: Record<string, string> | undefined; options?: Record<string, string> | undefined }): void {
        const fieldValue = dv.el('span', p[this.field.name], attrs);
        fieldContainer.appendChild(fieldValue);
    }

    createSettingContainer(container: HTMLDivElement, plugin: MetadataMenu, location?: SettingLocation): void {

        //initial values
        const options = this.field.options
        options.groupColors = (options.groupColors as string[] | undefined) || []
        options.groupLabels = (options.groupLabels as string[] | undefined) || []

        //layout
        const canvasPathContainer = container.createDiv({ cls: "field-container" });
        container.createEl("hr");
        const groupColorsContainer = container.createDiv({ cls: "field-container colors" });
        const groupLabelsContainer = container.createDiv({ cls: "field-container labels" });
        const newLabelContainer = container.createDiv({ cls: "field-container" })

        //builders
        this.createCanvasPathContainer(canvasPathContainer)
        this.buildColorsContainer(groupColorsContainer, options.groupColors, "Groups matching colors:");
        this.buildLabelsContainer(groupLabelsContainer, options.groupLabels, "Groups matching labels: ");
        this.buildNewLabelContainer(groupLabelsContainer, "Groups matching labels: ", newLabelContainer, options.groupLabels, "Add a new matching group name")
    }

    getOptionsStr(): string {
        return ""
    }

    validateOptions(): boolean {
        let error = false;
        if (!(this.field.options.canvasPath as string)?.endsWith(".canvas")) {
            error = true;
            FieldSettingsModal.setValidationError(
                this.canvasPathInput,
                "This is not a canvas file"
            );
        }
        return !error
    }
}