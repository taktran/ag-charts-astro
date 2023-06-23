import { FRAMEWORK_SLUGS } from "../constants";

export function FrameworkSelector({
  initialFramework,
  currentPage,
}: {
  initialFramework: string;
  currentPage: string;
}) {
  return (
    <label>
      Framework:{" "}
      <select
        defaultValue={initialFramework}
        onChange={(event) => {
          const newFramework = event.target.value;
          const newUrl = `/${newFramework}/${currentPage}`;
          window.location.href = newUrl;
        }}
      >
        {FRAMEWORK_SLUGS.map((framework) => {
          return (
            <option key={framework} value={framework}>
              {framework}
            </option>
          );
        })}
      </select>
    </label>
  );
}
