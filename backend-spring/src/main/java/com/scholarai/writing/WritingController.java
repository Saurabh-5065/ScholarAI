package com.scholarai.writing;

import com.scholarai.security.CurrentUser;
import com.scholarai.user.User;
import com.scholarai.writing.dto.WritingGenericResponse;
import com.scholarai.writing.dto.WritingImproveRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/writing")
public class WritingController {
    private final WritingService service;

    public WritingController(WritingService service) {
        this.service = service;
    }

    @PostMapping("/outline")
    public WritingGenericResponse outline(@CurrentUser User user, @Valid @RequestBody WritingImproveRequest request) {
        return service.execute(user, "/internal/writing/outline", request);
    }

    @PostMapping("/abstract")
    public WritingGenericResponse abstractText(@CurrentUser User user, @Valid @RequestBody WritingImproveRequest request) {
        return service.execute(user, "/internal/writing/abstract", request);
    }

    @PostMapping("/improve")
    public WritingGenericResponse improve(@CurrentUser User user, @Valid @RequestBody WritingImproveRequest request) {
        return service.execute(user, "/internal/writing/improve", request);
    }

    @PostMapping("/summarize")
    public WritingGenericResponse summarize(@CurrentUser User user, @Valid @RequestBody WritingImproveRequest request) {
        return service.execute(user, "/internal/writing/summarize", request);
    }

    @PostMapping("/extract-paper-insights")
    public WritingGenericResponse extract(@CurrentUser User user, @Valid @RequestBody WritingImproveRequest request) {
        return service.execute(user, "/internal/writing/extract-paper-insights", request);
    }

    @PostMapping("/citation-format")
    public WritingGenericResponse citationFormat(@CurrentUser User user, @Valid @RequestBody WritingImproveRequest request) {
        return service.execute(user, "/internal/writing/citation-format", request);
    }
}
