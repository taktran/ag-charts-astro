import classnames from "classnames";
import React from "react";
import styles from "./VideoSection.module.scss";

/**
 * This embeds a YouTube video into the page.
 */
export const VideoSection = ({ id, title, header, children }) => {
  return (
    <div className={classnames(styles.videoSection, "font-size-responsive")}>
      <div className={classnames({ [styles.header]: header })}>{children}</div>
      <iframe
        className={styles.ytIframe}
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        frameBorder="0"
        modestbranding="1"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
