package fi.morabotti.ipclassify.dto;

import fi.morabotti.ipclassify.domain.AccessRecord;
import fi.morabotti.ipclassify.domain.AccessRequestMessage;
import fi.morabotti.ipclassify.domain.IpClassification;

public enum TrafficLevel {
    NORMAL,
    WARNING,
    DANGER;

    public static TrafficLevel from(AccessRecord record) {
        if (Boolean.TRUE.equals(record.getDanger())) {
            return DANGER;
        }

        if (Boolean.TRUE.equals(record.getWarning())) {
            return WARNING;
        }

        return NORMAL;
    }

    public static TrafficLevel from(IpClassification classification) {
        if (Boolean.TRUE.equals(classification.getIsDanger())) {
            return DANGER;
        }

        if (Boolean.TRUE.equals(classification.getIsWarning())) {
            return WARNING;
        }

        return NORMAL;
    }

    public static TrafficLevel from(AccessRequestMessage message) {
        if (Boolean.TRUE.equals(message.getDanger())) {
            return DANGER;
        }

        if (Boolean.TRUE.equals(message.getWarning())) {
            return WARNING;
        }

        return NORMAL;
    }
}
