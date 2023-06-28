import { defineMarkdocConfig } from "@astrojs/markdoc/config";
import VideoSection from "./src/components/VideoSection.astro";

export default defineMarkdocConfig({
  tags: {
    videoSection: {
      render: VideoSection,
      attributes: {
        id: { type: String, required: true },
        title: { type: String },
      },
    },
  },
});
