import styled from "@emotion/styled";

const VideoContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 */
  iframe,
  embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
  }
`;

export const YoutubeDemo = () => (
  <VideoContainer>
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/PoJV0ay9PRc"
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </VideoContainer>
);
