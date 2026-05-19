package com.blue.app.chat.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.blue.app.common.BaseModel;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Document(collection = "chats")
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Chat extends BaseModel {

    @NotBlank
    @Size(min = 2, max = 30)
    private String name;

    @Size(max = 500)
    private String description;

    @NotBlank
    @Field(name = "creator_id")
    private String creatorId;
}
