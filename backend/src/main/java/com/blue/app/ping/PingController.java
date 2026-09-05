package com.blue.app.ping;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@PreAuthorize("isAuthenticated()")
@AllArgsConstructor
public class PingController {

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
