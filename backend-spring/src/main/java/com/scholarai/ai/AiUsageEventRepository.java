package com.scholarai.ai;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AiUsageEventRepository extends JpaRepository<AiUsageEvent, UUID> {
}
