import io
import math
import struct
import unittest
import wave

from app import app


def sine_wave(seconds: float = 2.0, sample_rate: int = 22050) -> io.BytesIO:
    stream = io.BytesIO()
    with wave.open(stream, "wb") as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(sample_rate)
        frames = (
            struct.pack("<h", int(12000 * math.sin(2 * math.pi * 440 * index / sample_rate)))
            for index in range(int(seconds * sample_rate))
        )
        audio.writeframes(b"".join(frames))
    stream.seek(0)
    return stream


class PortfolioApiSmokeTest(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True)
        self.client = app.test_client()

    def test_health_and_genres(self):
        health = self.client.get("/health")
        self.assertEqual(health.status_code, 200)
        self.assertTrue(health.json["services"]["music"]["available"])

        genres = self.client.get("/v1/music/genres")
        self.assertEqual(genres.status_code, 200)
        self.assertEqual(len(genres.json["genres"]), 10)

    def test_music_classification(self):
        response = self.client.post(
            "/v1/music/classify",
            data={"audio": (sine_wave(), "tone.wav")},
            content_type="multipart/form-data",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn(response.json["genre"], response.json["genres"] if "genres" in response.json else [item["genre"] for item in response.json["top_predictions"]])
        self.assertEqual(len(response.json["top_predictions"]), 3)

    def test_food_without_secret_is_explicit(self):
        response = self.client.get("/v1/food/products")
        self.assertEqual(response.status_code, 503)


if __name__ == "__main__":
    unittest.main()
