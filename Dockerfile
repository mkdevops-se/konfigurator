FROM quay.io/centos7/nodejs-12-centos7
LABEL "io.openshift.s2i.scripts-url"="image:///usr/libexec/s2i" \
      "io.openshift.s2i.build.image"="quay.io/centos7/nodejs-12-centos7"
ENV WEB_SERVER_HOST="0.0.0.0" \
    WEB_SERVER_PORT="3000" \
    DATABASE_URL="tmp/konfigurator.db" \
    DATABASE_DROP_SCHEMA="false" \
    DATABASE_SYNCHRONIZE="true"
USER root
# Copying in source code
COPY . /tmp/src
# Change file ownership to the assemble user. Builder image must support chown command.
RUN chown -R 1001:0 /tmp/src
USER 1001
# Assemble script sourced from builder image based on user input or image metadata.
# If this file does not exist in the image, the build will fail.
RUN /usr/libexec/s2i/assemble
# Run script sourced from builder image based on user input or image metadata.
# If this file does not exist in the image, the build will fail.
CMD /usr/libexec/s2i/run
