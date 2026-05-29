package com.blue.app.chat.models;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.blue.app.common.BaseModel;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Document(collection = "messages")
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message extends BaseModel {

    @NotBlank
    @Indexed
    @Field(name = "chat_id")
    private String chatId;

    @NotBlank
    @Size(min = 1, max = 2000)
    private String content;

    @NotBlank
    @Field(name = "sender_id")
    private String senderId;

    @Builder.Default
    private MessageType type = MessageType.TEXT;
}
