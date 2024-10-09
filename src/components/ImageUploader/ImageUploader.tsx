import { type UploadFile, fileUploader } from "@solid-primitives/upload";
import { type ComponentProps, createSignal } from "solid-js";
import { For } from "solid-js";

interface Props extends ComponentProps<"input"> {
	label: string;
}

export function ImageUploader(props: Props) {
	const [files, setFiles] = createSignal<UploadFile[]>([]);

	return (
		<>
			<div class="prose prose-sm flex flex-col font-medium gap-1">
				<label for={props.name}>{props.label}</label>
				<input
					required={props.required}
					name={props.name}
					type="file"
					accept="image/*"
					multiple
					use:fileUploader={{
						userCallback: (fs) => fs.forEach((f) => console.log(f)),
						setFiles,
					}}
				/>

				<ul class="mt-0">
					<For each={files()}>
						{(item) => (
							<a href={item.source} target="_blank" rel="noreferrer">
								<li>{item.name}</li>
							</a>
						)}
					</For>
				</ul>
			</div>
		</>
	);
}
