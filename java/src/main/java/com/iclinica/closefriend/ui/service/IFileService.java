package com.iclinica.closefriend.ui.service;

import com.iclinica.closefriend.core.dto.Tuple3;

import java.io.IOException;

public interface IFileService {
    Tuple3<byte[], Long, String> getFile(String resourceLocation) throws IOException;
}
