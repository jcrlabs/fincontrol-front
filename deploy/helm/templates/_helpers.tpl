{{- define "fincontrol-front.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "fincontrol-front.fullname" -}}
{{- printf "%s" (include "fincontrol-front.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "fincontrol-front.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/name: {{ include "fincontrol-front.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "fincontrol-front.selectorLabels" -}}
app.kubernetes.io/name: {{ include "fincontrol-front.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
