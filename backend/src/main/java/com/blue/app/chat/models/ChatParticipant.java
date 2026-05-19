package com.blue.app.chat.models;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.blue.app.common.BaseModel;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Document(collection = "chat_participants")
@CompoundIndexes({
        @CompoundIndex(name = "chat_user_unique", def = "{'chat_id': 1, 'user_id': 1}", unique = true)
})
@SuperBuilder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatParticipant extends BaseModel {

    @NotBlank
    @Field(name = "chat_id")
    private String chatId;

    @NotBlank
    @Field(name = "user_id")
    private String userId;

    @NotNull
    private Role role;
}
