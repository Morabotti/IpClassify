package fi.morabotti.ipclassify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class RecordMetadata {
    private List<String> applications;
    private List<String> countries;
    private List<String> cities;
    private List<String> timezones;
}
