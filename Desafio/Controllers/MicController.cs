using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace Desafio.Controllers
{
    [Route("api/mic")]
    [ApiController]
    public class MicController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public MicController(IHttpClientFactory factory)
        {
            _httpClient = factory.CreateClient();
        }

        [HttpPost("transcrever")]
        public async Task<IActionResult> Transcrever([FromForm] IFormFile file)
        {
            using var content = new MultipartFormDataContent();
            using var stream = file.OpenReadStream();
            content.Add(new StreamContent(stream), "file", file.FileName);
            content.Add(new StringContent("whisper-1"), "model");

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", "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");

            var response = await _httpClient.PostAsync("https://api.openai.com/v1/audio/transcriptions", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            return Content(responseContent, "application/json");
        }
    }
}
