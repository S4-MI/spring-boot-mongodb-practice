package com.blue.app.dto;

import java.util.List;
import org.springframework.data.domain.Page;

public record PagedResponse<T>(
        int page,
        int size,
        long count,
        int totalPages,
        List<T> results
) {
    public static <T> PagedResponse<T> from(Page<T> p) {
        return new PagedResponse<>(
                p.getNumber(),
                p.getSize(),
                p.getTotalElements(),
                p.getTotalPages(),
                p.getContent()
        );
    }
}
