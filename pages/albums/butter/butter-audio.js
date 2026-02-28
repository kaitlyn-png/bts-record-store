const butterVinyl = document.getElementById("butter_vinyl");
const butterAudio = document.getElementById("butter_audio");

if (butterVinyl && butterAudio) {
  butterVinyl.addEventListener("click", async () => {
    const hasAudioSource = Boolean(
      butterAudio.currentSrc ||
      butterAudio.getAttribute("src") ||
      butterAudio.querySelector("source")?.getAttribute("src")
    );

    if (!hasAudioSource) {
      return;
    }

    if (butterAudio.paused) {
      try {
        await butterAudio.play();
        butterVinyl.classList.add("is-playing");
      } catch (error) {
        console.error(error);
      }
    } else {
      butterAudio.pause();
      butterAudio.currentTime = 0;
      butterVinyl.classList.remove("is-playing");
    }
  });

  butterAudio.addEventListener("ended", () => {
    butterVinyl.classList.remove("is-playing");
  });
}
