package com.iclinica.closefriend.ui.service;

import com.iclinica.closefriend.core.constant.MimeTypes;
import com.iclinica.closefriend.core.dto.Tuple3;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@Service
@Slf4j
public class FileService implements IFileService {

    @Override
    @Cacheable(value = "Files", key = "{#resourceLocation}", unless = "#result == null")
    public Tuple3<byte[], Long, String> getFile(String resourceLocation) throws IOException {
        log.info("Received file request of {}", resourceLocation);
        File file = ResourceUtils.getFile(resourceLocation);
        Path path = Paths.get(file.getAbsolutePath());
        String contentType = null;
        try {
            contentType = Files.probeContentType(path);
            if(contentType == null)
                contentType = MimeTypes.getMimeType(FilenameUtils.getExtension(resourceLocation));
        } catch (Exception ex) {
            log.error("Unable to determine the content type of {}", path, ex);
            contentType = MimeTypes.getMimeType(FilenameUtils.getExtension(resourceLocation));
        }
        long length = Files.size(path);
        byte[] bytes = IOUtils.toByteArray(new FileInputStream(file));
        return new Tuple3(bytes, length, contentType);
    }

}
