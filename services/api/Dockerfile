# services/api/Dockerfile

FROM python:3.12-slim

WORKDIR /api/app

COPY ./app/requirements.txt /api/app/requirements.txt

RUN pip install --upgrade pip \
    && pip install -r /api/app/requirements.txt

# RUN pip install --no-cache-dir --upgrade pip \
#     && pip install --no-cache-dir -r /api/app/requirements.txt

COPY ./app /api/app

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
